// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

import "../libraries/Ownable.sol";
import "../libraries/ReentrancyGuard.sol";
import "../libraries/SafeMath.sol";
import "../libraries/Pausable.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/ISotaTier.sol";
import "../extensions/SotaWhitelist.sol";

contract Pool is Ownable, ReentrancyGuard, Pausable, SotaWhitelist {
    using SafeMath for uint256;

    uint constant MAX_NUM_TIERS = 10;

    // The token being sold
    IERC20 public token;

    // The address of factory contract
    address public factory;

    // The address of tier contract
    address public tier;

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

    // Name of ICO Pool
    string public name;

    // Ether to token conversion rate
    uint256 private etherConversionRate;

    // Ether to token conversion rate decimals
    uint256 private etherConversionRateDecimals = 0;

    // Token limit amount user can buy each tier
    uint[MAX_NUM_TIERS] public tierLimitBuy;

    // Number of token user purchased
    mapping(address => uint256) public userPurchased;

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
    event PoolCreated(string name, address token, uint256 openTime, uint256 closeTime, uint256 ethRate, uint256 ethRateDecimals, address wallet, address owner);
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
     * @param _name Name of ICO Pool
     * @param _token Address of the token being sold
     * @param _duration Duration of ICO Pool
     * @param _openTime When ICO Started
     * @param _ethRate Number of token units a buyer gets per wei
     * @param _tier Contract address of Sota Tiers
     * @param _tierLimitBuy Array of max token user can buy each tiers
     * @param _wallet Address where collected funds will be forwarded to
     */
    function initialize(string calldata _name, address _token, uint256 _duration, uint256 _openTime, uint256 _ethRate, uint256 _ethRateDecimals, address _tier, uint[MAX_NUM_TIERS] calldata _tierLimitBuy, address _wallet) external {
        require(msg.sender == factory, "POOL::UNAUTHORIZED");
        require(_tier != address(0), "POOL::ZERO_TIER_ADDRESS");
        require(_tierLimitBuy[0] != 0, "POOL::ZERO_TIER_LIMIT_BUY");

        name = _name;
        token = IERC20(_token);
        openTime = _openTime;
        closeTime = _openTime.add(_duration);
        etherConversionRate = _ethRate;
        etherConversionRateDecimals = _ethRateDecimals;
        tier = _tier;
        tierLimitBuy = _tierLimitBuy;
        fundingWallet = _wallet;
        owner = tx.origin;
        paused = false;

        emit PoolCreated(_name, _token, _openTime, closeTime, _ethRate, _ethRateDecimals, _wallet, owner);
    }

    /**
     * @notice Returns the conversion rate when user buy by eth
     * @return Returns only a fixed number of rate.
     */
    function getEtherConversionRate() public view returns (uint256) {
        return etherConversionRate;
    }

    /**
     * @notice Returns the conversion rate decimals when user buy by eth
     * @return Returns only a fixed number of decimals.
     */
    function getEtherConversionRateDecimals() public view returns (uint256) {
        return etherConversionRateDecimals;
    }

    /**
     * @notice Returns the conversion rate when user buy by eth
     * @return Returns only a fixed number of token rate.
     * @param _token address of token to query token exchange rate
     */
    function getErc20TokenConversionRate(address _token) public view returns (uint256) {
        return erc20TokenConversionRate[_token];
    }

    /**
     * @notice Owner can set the eth conversion rate. Receiver tokens = wei * etherConversionRate / 10 ** etherConversionRateDecimals
     * @param _rate Fixed number of ether rate
     * @param _rateDecimals Fixed number of ether rate decimals
     */
    function setEtherConversionRateAndDecimals(uint256 _rate, uint256 _rateDecimals) public onlyOwner {
        etherConversionRate = _rate;
        etherConversionRateDecimals = _rateDecimals;
        emit PoolStatsChanged();
    }
    /**
     * @notice Owner can set the eth conversion rate. Receiver tokens = wei * etherConversionRate / 10 ** etherConversionRateDecimals
     * @param _rate Fixed number of ether rate
     */
    function setEtherConversionRate(uint256 _rate) public onlyOwner {
        require(etherConversionRate != _rate, "POOL::RATE_INVALID");
        etherConversionRate = _rate;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the eth conversion rate decimals. Receiver tokens = wei * etherConversionRate / 10 ** etherConversionRateDecimals
     * @param _rateDecimals Fixed number of ether rate decimals
     */
    function setEtherConversionRateDecimals(uint256 _rateDecimals) public onlyOwner {
        etherConversionRateDecimals = _rateDecimals;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the token conversion rate. Receiver tokens = tradeTokens * tokenRate
     * @param _token address of token to query token exchange rate
     */
    function setErc20TokenConversionRate(address _token, uint256 _rate) public onlyOwner {
        require(erc20TokenConversionRate[_token] != _rate, "POOL::RATE_INVALID");
        erc20TokenConversionRate[_token] = _rate;
        emit AllowTokenToTradeWithRate(_token, _rate);
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
        uint256 _deadline,
        bytes memory _signature
    )
        public
        payable
        whenNotPaused
        nonReentrant
    {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(_beneficiary, weiAmount);
        require(_validPurchase(), "POOL::ENDED");
        require(_verifyWhitelist(_candidate, _maxAmount, _deadline, _signature));

        // calculate token amount to be created
        uint256 tokens = _getEtherToTokenAmount(weiAmount);
        

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
        uint256 _deadline,
        bytes memory _signature
    )
        public
        whenNotPaused
        nonReentrant
        tokenRateSetted(_token)
    {
        require(_token != address(token), "POOL::TOKEN_INVALID");
        require(_validPurchase(), "POOL::ENDED");
        require(_verifyWhitelist(_candidate, _maxAmount, _deadline, _signature));

        _verifyAllowance(msg.sender, _token, _amount);
        
        _preValidatePurchase(_beneficiary, _amount);

        require(
            getErc20TokenConversionRate(_token) != 0,
            "POOL::TOKEN_NOT_ALLOWED"
        );


        uint256 tokens = _getTokenToTokenAmount(_token, _amount);
        uint userTier = ISotaTier(tier).getUserTier(_beneficiary);
        require(userPurchased[_beneficiary].add(tokens) <= tierLimitBuy[userTier], "POOL::LIMIT_BUY_EXCEED");

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
    * @param _weiAmount Value in wei to be converted into tokens
    * @return Number of tokens that can be purchased with the specified _weiAmount
    */
    function _getEtherToTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 rate = getEtherConversionRate();
        return _weiAmount.mul(rate).div(10 ** etherConversionRateDecimals);
    }

    /**
    * @dev Override to extend the way in which ether is converted to tokens.
    * @param _token Address of exchange token
    * @param _amount Value of exchange tokens
    * @return Number of tokens that can be purchased with the specified _weiAmount
    */
    function _getTokenToTokenAmount(address _token, uint256 _amount) internal view returns (uint256) {
        uint256 rate = getErc20TokenConversionRate(_token);
        return _amount.mul(rate);
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

    function _verifyWhitelist(address _candidate, uint256 _maxAmount, uint256 _deadline, bytes memory _signature) private view returns (bool) {
        if (useWhitelist) {
            return (verify(owner, _candidate, _maxAmount, _deadline, _signature));
        }
        return true;
    }
}