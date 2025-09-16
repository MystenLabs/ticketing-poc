module ticketing_poc::utils;

use sui::{clock, test_scenario::{Self as ts, Scenario}, test_utils};
use ticketing_poc::{init, key_registry::KeyRegistry, loyalty::{Self, Loyalty}};

public fun setup(sender: address): (Scenario, KeyRegistry, Loyalty) {
    let mut scenario = ts::begin(sender);
    let clock = clock::create_for_testing(scenario.ctx());

    init::init_for_testing(scenario.ctx());
    loyalty::mint(&clock, scenario.ctx());

    scenario.next_tx(sender);
    let registry = scenario.take_shared<KeyRegistry>();
    let loyalty = scenario.take_from_sender<Loyalty>();

    clock.destroy_for_testing();
    (scenario, registry, loyalty)
}

public fun cleanup(scenario: Scenario, registry: KeyRegistry, loyalty: Loyalty) {
    ts::return_shared(registry);
    test_utils::destroy(loyalty);
    scenario.end();
}

public fun admin_address(): address {
    @0x5b0e78b7033a8b5e5df433aba4171eb6c4656508b0b0702a120966a78d82d93f
}

public fun admin_pk(): vector<u8> {
    x"9f6311882b31b1eaf3fd2f423de5b20c2b389a028f80a5037d00f9b8a7896093"
}

public fun ticket_minter_address(): address {
    @0xe64fb656003cc30a7a8ceca9691b11128d076b5b1f41a5a80e6b030d7d9690ff
}

public fun admin_ticket_mint_bytes(): vector<u8> {
    x"105469636b65744d696e745065726d697459ee08fe2d0e74a1e64fb656003cc30a7a8ceca9691b11128d076b5b1f41a5a80e6b030d7d9690ff0133006a6898930100000d56656e6963652c204974616c7911526f79616c204d61736b65642048616c6c0a53656374696f6e20303301025535fa00000000000000475374657020696e746f206120776f726c64206f66206d79737465727920616e6420656c6567616e6365206174206f7572206772616e64206d6173717565726164652062616c6c2e114d61676963204c6967687420696e2049542800000000000000"
}

public fun admin_ticket_mint_signature(): vector<u8> {
    x"a71057086cdddcfdf7c8d3faeec3061e6f03ec0e63c08f72871bc3d71a61c154d7dd4fa969523b81e32cdc65cf5934459c0e426c66b2b16ab6ef773891c89909"
}

public fun admin_ticket_mint_bytes_domain_mismatch(): vector<u8> {
    x"0544554d4d59c66943bb0b10d5f0e64fb656003cc30a7a8ceca9691b11128d076b5b1f41a5a80e6b030d7d9690ff0133006a6898930100000d56656e6963652c204974616c7911526f79616c204d61736b65642048616c6c0a53656374696f6e20303301025932fa00000000000000475374657020696e746f206120776f726c64206f66206d79737465727920616e6420656c6567616e6365206174206f7572206772616e64206d6173717565726164652062616c6c2e114d61676963204c6967687420696e2049542800000000000000"
}

public fun admin_ticket_mint_signature_domain_mismatch(): vector<u8> {
    x"3478bc2fca7601fb47d79d01c32ee0e2ce8eafa3fafac8fcbb6862f2f4e5631535ba311a1d86552c94d1ae05d66ea6a15ac86f39436d3139eaf32b1caa3d8a0d"
}

public fun admin_ticket_mint_nonce(): u64 {
    11633939328103149145
}

public fun admin_loyalty_id(): ID {
    object::id_from_address(@0x4cf14259b84181ab49d282b6d0859b8860c10b431b60022db569af93d850f5fb)
}

public fun admin_loyalty_point_bytes(): vector<u8> {
    x"124c6f79616c7479506f696e745065726d69748feb309b634c321f4cf14259b84181ab49d282b6d0859b8860c10b431b60022db569af93d850f5fbf401000000000000"
}

public fun admin_loyalty_point_signature(): vector<u8> {
    x"848cd754d4ea82e1ab430e01479e3c2d0b034bb5bb579d0304e581f2b6121909e5e822fe9295d6c60b7b6a2c96c0bc9e31434b968f6de1494ef2e4f0e564dd04"
}

public fun admin_loyalty_point_bytes_domain_mismatch(): vector<u8> {
    x"0444454d4f416b379bc4a6c19e75b6758a05e5945c492eb147dcfe2e58df886a71ff36c25b2ad07bec42cd407af401000000000000"
}

public fun admin_loyalty_point_signature_domain_mismatch(): vector<u8> {
    x"788986e2d3ef6881283de5dbbe323329e1f5ce53a99279b6265d7293378c4d3c1bcd295b04e49156684b9c62d2a2051a15fc15e4290b3c571d9307c57698a60a"
}
