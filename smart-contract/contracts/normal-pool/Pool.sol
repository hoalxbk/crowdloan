// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

import "../interfaces/IERC20.sol";
import "../interfaces/IPoolFactory.sol";
import "../interfaces/ISotaTier.sol";
import "../libraries/Ownable.sol";
import "../libraries/ReentrancyGuard.sol";
import "../libraries/SafeMath.sol";
import "../libraries/Pausable.sol";
import "../extensions/SotaWhitelist.sol";

contract Pool is Ownable, ReentrancyGuard, Pausable, SotaWhitelist {
    using SafeMath for uint256;

    uint constant MAX_NUM_TIERS = 10;

    struct OfferedCurrency {
        address currency;
        uint256 decimals;
        uint256 rate;
    }

    // The token being sold
    IERC20 public token;

    // The address of factory contract
    address public factory;

    // Address where funds are collected
    address public fundingWallet;

    // Timestamps when token started to sell
    uint256 public openTime = block.timestamp;

    // Timestamps when token stopped to sell
    uint256 public closeTime;

    // Amount of wei raised
    uint256 public weiRaised = 0;

    // Amount of token sold
    uint256 public tokenSold = 0;

    // Token limit amount user can buy each tier
    uint[MAX_NUM_TIERS] public tierLimitBuy;

    // Number of token user purchased
    mapping(address => uint256) public userPurchased;

    // Get offered currencies
    OfferedCurrency[] public offeredCurrency;

    // Pool extensions
    bool public useWhitelist;

    // Token to token conversion rate
    mapping(address => uint256) private erc20TokenConversionRate;

    modifier tokenRateSetted(address _token) {
        require(erc20TokenConversionRate[_token] != 0, "POOL::TOKEN_NOT_ALLOWED");
        _;
    }

    // -----------------------------------------
    // Lauchpad Starter's event
    // -----------------------------------------
    event PoolCreated(address token, uint256 openTime, uint256 closeTime, address offeredCurrency, uint256 offeredCurrencyDecimals, uint256 offeredCurrencyRate, address wallet, address owner);
    event AllowTokenToTradeWithRate(address token, uint256 rate);
    event TokenPurchaseByEther(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
    event TokenPurchaseByToken(address indexed purchaser, address indexed beneficiary, address token, uint256 value, uint256 amount);
    event RefundedIcoToken(address wallet, uint256 amount);
    event PoolStatsChanged();
    // -----------------------------------------
    // Constructor
    // -----------------------------------------
    constructor () {
        factory = msg.sender;
    }

    // -----------------------------------------
    // Lauchpad Starter external interface
    // -----------------------------------------

    /**
    * @dev fallback function
    */
    fallback () external {
        revert();
    }

    /**
    * @dev fallback function
    */
    receive () external payable {
        revert();
    }

    /**
     * @param _token Address of the token being sold
     * @param _duration Duration of ICO Pool
     * @param _openTime When ICO Started
     * @param _offeredCurrency Address of offered token
     * @param _offeredCurrencyDecimals Decimals of offered token
     * @param _offeredRate Number of currency token units a buyer gets
     * @param _tierLimitBuy Array of max token user can buy each tiers
     * @param _wallet Address where collected funds will be forwarded to
     */
    function initialize(address _token, uint256 _duration, uint256 _openTime, address _offeredCurrency, uint256 _offeredCurrencyDecimals, uint256 _offeredRate, uint[MAX_NUM_TIERS] calldata _tierLimitBuy, address _wallet) external {
        require(msg.sender == factory, "POOL::UNAUTHORIZED");

        token = IERC20(_token);
        openTime = _openTime;
        closeTime = _openTime.add(_duration);
        tierLimitBuy = _tierLimitBuy;
        fundingWallet = _wallet;
        owner = tx.origin;
        paused = false;

        offeredCurrency.push(OfferedCurrency({
            currency: _offeredCurrency,
            decimals: _offeredCurrencyDecimals,
            rate: _offeredRate
        }));

        emit PoolCreated(_token, _openTime, closeTime, _offeredCurrency, _offeredCurrencyDecimals, _offeredRate, _wallet, owner);
    }

    /**
     * @notice Returns the conversion rate when user buy by offered token
     * @return Returns only a fixed number of rate.
     */
    function getOfferedCurrencyRate() public view returns (uint256) {
        return offeredCurrency[0].rate;
    }

    /**
     * @notice Returns the conversion rate decimals when user buy by offered token
     * @return Returns only a fixed number of decimals.
     */
    function getOfferedCurrencyDecimals() public view returns (uint256) {
        return offeredCurrency[0].decimals;
    }

    /**
     * @notice Owner can set the offered token conversion rate. Receiver tokens = tradeTokens * tokenRate
     * @param _rate Fixed number of ether rate
     * @param _decimals Fixed number of ether rate decimals
     */
    function setOfferedCurrencyRateAndDecimals(uint256 _rate, uint256 _decimals) public onlyOwner {
        offeredCurrency[0].rate = _rate;
        offeredCurrency[0].decimals = _decimals;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the offered token conversion rate. Receiver tokens = wei * etherConversionRate / 10 ** etherConversionRateDecimals
     * @param _rate Fixed number of ether rate
     */
    function setOfferedCurrencynRate(uint256 _rate) public onlyOwner {
        require(offeredCurrency[0].rate != _rate, "POOL::RATE_INVALID");
        offeredCurrency[0].rate = _rate;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the eth conversion rate decimals. Receiver tokens = wei * etherConversionRate / 10 ** etherConversionRateDecimals
     * @param _decimals Fixed number of offered token decimals
     */
    function setEtherConversionRateDecimals(uint256 _decimals) public onlyOwner {
        offeredCurrency[0].decimals = _decimals;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the limit token amount each tiers can buy.
     * @param _tierLimitBuy array of ascending limit token buy-able amount
     */
    function setTierLimitBuy(uint[MAX_NUM_TIERS] calldata _tierLimitBuy)
        public
        onlyOwner
    {
        require(_tierLimitBuy[0] != 0, "POOL::ZERO_TIER_LIMIT_BUY");
        tierLimitBuy = _tierLimitBuy;
        emit PoolStatsChanged();
    }

    /**
    * @notice Owner can set the close time (time in seconds). User can buy before close time.
    * @param _closeTime Value in uint256 determine when we stop user to by tokens
    */
    function setCloseTime(uint256 _closeTime) public onlyOwner () {
        require(_closeTime >= block.timestamp, "POOL::INVALID_TIME");
        closeTime = _closeTime;
        emit PoolStatsChanged();
    }

    /**
    * @notice Owner can set the open time (time in seconds). User can buy after open time.
    * @param _openTime Value in uint256 determine when we allow user to by tokens
    */
    function setOpenTime(uint256 _openTime) public onlyOwner () {
        openTime = _openTime;
        emit PoolStatsChanged();
    }

    /**
    * @notice Owner can set the open time (time in seconds). User can buy after open time.
    * @param _whitelist Value in bool. True if using whitelist
    */
    function setPoolExtentions(bool _whitelist) public onlyOwner () {
        useWhitelist = _whitelist;
        emit PoolStatsChanged();
    }

    function buyTokenByEtherWithPermission(
        address _beneficiary,
        address _candidate,
        uint256 _maxAmount,
        bytes memory _signature
    )
        public
        payable
        whenNotPaused
        nonReentrant
    {
        uint256 weiAmount = msg.value;
        address currency = offeredCurrency[0].currency;
        _preValidatePurchase(_beneficiary, weiAmount);
        require(currency == address(0), "POOL::WRONG_BUY_METHOD");
        require(_validPurchase(), "POOL::ENDED");
        require(_verifyWhitelist(_candidate, _maxAmount, _signature));

        // calculate token amount to be created
        uint256 tokens = _getOfferedCurrencyToTokenAmount(weiAmount);
        _verifyTierLimitBuy(_beneficiary, tokens);

        _deliverTokens(_beneficiary, tokens);

        _forwardFunds(weiAmount);

        _updatePurchasingState(weiAmount, tokens);
        emit TokenPurchaseByEther(msg.sender, _beneficiary, weiAmount, tokens);
    }

    /**
    * @notice Calculate the tokens user can receive. Receive User's trade tokens and transfer tokens
    * @dev tokens = _token * token Conversion Rate Of _token
    * @param _beneficiary Address performing the token purchase
    * @param _token Address of willing to exchange to ke performing the token purchase
    * @param _amount Value of amount will exchange of tokens
    */
    function buyTokenByTokenWithPermission(
        address _beneficiary,
        address _token,
        uint256 _amount,
        address _candidate,
        uint256 _maxAmount,
        bytes memory _signature
    )
        public
        whenNotPaused
        nonReentrant
        tokenRateSetted(_token)
    {
        require(offeredCurrency[0].currency != address(0), "POOL::WRONG_BUY_METHOD");
        require(_validPurchase(), "POOL::ENDED");
        require(_verifyWhitelist(_candidate, _maxAmount, _signature));

        _verifyAllowance(msg.sender, _token, _amount);

        _preValidatePurchase(_beneficiary, _amount);

        require(
            _token == offeredCurrency[0].currency,
            "POOL::TOKEN_NOT_ALLOWED"
        );

        uint256 tokens = _getOfferedCurrencyToTokenAmount(_amount);
        _verifyTierLimitBuy(_beneficiary, tokens);

        _deliverTokens(_beneficiary, tokens);

        _forwardTokenFunds(_token, _amount);

        _updatePurchasingState(0, tokens);

        emit TokenPurchaseByToken(
            msg.sender,
            _beneficiary,
            _token,
            _amount,
            tokens
        );
    }
    /**
    * @notice Return true if pool has ended
    * @dev User cannot purchase / trade tokens when isFinalized == true
    * @return true if the ICO Ended.
    */
    function isFinalized() public view returns (bool) {
        return block.timestamp >= closeTime;
    }

    /**
    * @notice Owner can receive their remaining tokens when ICO Ended
    * @dev  Can refund remainning token if the ico ended
    * @param _wallet Address wallet who receive the remainning tokens when Ico end
    * @param _amount Value of amount will exchange of tokens
    */
    function refundRemainingTokens(address _wallet, uint _amount) external onlyOwner {
        require(isFinalized(), "POOL::ICO_NOT_ENDED");
        require(token.balanceOf(address(this)) > 0, "POOL::EMPTY_BALANCE");
        _deliverTokens(_wallet, _amount);
        emit RefundedIcoToken(_wallet, _amount);
    }

    /**
    * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
    * @param _beneficiary Address performing the token purchase
    * @param _weiAmount Value in wei involved in the purchase
    */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal pure {
        require(_beneficiary != address(0), "POOL::INVALID_BENEFICIARY");
        require(_weiAmount != 0, "POOL::INVALID_WEI_AMOUNT");
    }

    /**
    * @dev Override to extend the way in which ether is converted to tokens.
    * @param _amount Value in wei to be converted into tokens
    * @return Number of tokens that can be purchased with the specified _weiAmount
    */
    function _getOfferedCurrencyToTokenAmount(uint256 _amount) internal view returns (uint256) {
        uint256 rate = getOfferedCurrencyRate();
        uint256 decimals = getOfferedCurrencyDecimals();
        return _amount.mul(rate).div(10 ** decimals);
    }

    /**
    * @dev Source of tokens. Transfer / mint
    * @param _beneficiary Address performing the token purchase
    * @param _tokenAmount Number of tokens to be emitted
    */
    function _deliverTokens(
        address _beneficiary,
        uint256 _tokenAmount
    )
      internal
    {
      token.transfer(_beneficiary, _tokenAmount);
      userPurchased[_beneficiary] = userPurchased[_beneficiary].add(_tokenAmount);
    }

    /**
    * @dev Determines how ETH is stored/forwarded on purchases.
    */
    function _forwardFunds(uint256 _value) internal {
        address payable wallet = address(uint160(fundingWallet));
        (bool success, ) = wallet.call{value: _value}("");
        require(success, "POOL::WALLET_TRANSFER_FAILED");
    }

    /**
    * @dev Determines how Token is stored/forwarded on purchases.
    */
    function _forwardTokenFunds(address _token, uint _amount) internal {
        IERC20(_token).transferFrom(msg.sender, fundingWallet, _amount);
    }

    /**
    * @param _tokens Value of sold tokens
    * @param _weiAmount Value in wei involved in the purchase
    */
    function _updatePurchasingState(
        uint256 _weiAmount,
        uint256 _tokens
    )
      internal
    {
      weiRaised = weiRaised.add(_weiAmount);
      tokenSold = tokenSold.add(_tokens);
    }

    // @return true if the transaction can buy tokens
    function _validPurchase() internal view returns (bool) {
        bool withinPeriod = block.timestamp >= openTime && block.timestamp <= closeTime;
        return withinPeriod;
    }

    /**
   * @dev Transfer eth to an address
   * @param _to Address receiving the eth
   * @param _amount Amount of wei to transfer
   */
    function _transfer(address _to, uint256 _amount) private {
        address payable payableAddress = address(uint160(_to));
        (bool success, ) = payableAddress.call{value: _amount}("");
        require(success, "POOL::TRANSFER_FEE_FAILED");
    }

    /**
   * @dev Transfer token to an address
   * @param _to Address receiving the eth
   * @param _amount Amount of wei to transfer
   */
    function _transferToken(address _token, address _to, uint256 _amount) private {
        IERC20(_token).transferFrom(msg.sender, _to, _amount);
    }

    function _verifyAllowance(address _user, address _token, uint256 _amount) private view {
        IERC20 tradeToken = IERC20(_token);
        uint256 allowance = tradeToken.allowance(_user, address(this));
        require(allowance >= _amount, "POOL::TOKEN_NOT_APPROVED");
    }

    function _verifyTierLimitBuy(address _user, uint256 _amount) private view {
		address tier = IPoolFactory(factory).getTier();
        uint userTier = ISotaTier(tier).getUserTier(_user);
        require(userPurchased[_user].add(_amount) <= tierLimitBuy[userTier], "POOL::LIMIT_BUY_EXCEED");
    }

    function _verifyWhitelist(address _candidate, uint256 _maxAmount, bytes memory _signature) private view returns (bool) {
        if (useWhitelist) {
            return (verify(owner, _candidate, _maxAmount, _signature));
        }
        return true;
    }
}