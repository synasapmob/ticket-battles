module shared_module::shared {
  public fun MAX_TOKEN(): u64 {
    // between 0-24
    return 24
  }

  public fun PRICE_SWAP_TICKET_TO_GET_NFT(): u64 {
    return 4
  }

  public fun ENOUGH_PARTICIPANTS_POOL(): u64 {
    return 4
  }

  public fun PRICE_MINT_TICKET(): u64 {
    // transfer:  1 SUI = 10^9 MIST
    // calc:      (10 ** 9) * 0.045

    return 450000
  }

  public fun TREASURY_ADMIN(): address {
    return @0x05153977c37355b20059e6d2163d6e829786ecffd679e573e8d74757913d50a0
  }
}