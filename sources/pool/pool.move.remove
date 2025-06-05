// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module pool_module::pool {
  use ticket_module::ticket::{Ticket};
  use std::string;
  use sui::event;
  use nft_module::nft;

  const ENOUGH_PARTICIPANT: u64 = 2;

  // ===== Define =====
  public struct Pool has key, store {
    id: UID,
    // who joined pool
    participant: string::String,
    // how many people
    next_id: u64,
  }
  
  // ===== Events =====
  public struct PoolEvent has copy, drop {
    participant: address,
    next_id: u64,
    begin: bool,
  }

  // ===== Entrypoints =====
  public fun init_pool(_ctx: &mut TxContext) {
    let pool = Pool {
      id: object::new(_ctx),
      next_id: 0,
      participant: _ctx.sender().to_string()
    };

    // event::emit(PoolEvent {
    //   next_id: pool.next_id,
    //   participant: pool.participant,
    //   begin: false,
    // });

    transfer::public_share_object(pool);
  }
    
  public fun join(
    _pool: &mut Pool,
    _collection: &mut nft::Collection,
    _ticket: Ticket,
    _ctx: &mut TxContext
  ) {
    let mut begin = false;
    _pool.next_id = _pool.next_id + 1;

    // at time available to start pool
    if(_pool.next_id == ENOUGH_PARTICIPANT) {
      nft::mint(_collection, _ticket, _ctx);
      _pool.next_id = 0;
      begin = true;
    }else {
      _ticket.burn(_ctx);
    };

    event::emit(PoolEvent { 
      participant: _ctx.sender(),
      next_id: _pool.next_id,
      begin
    });
  }
}