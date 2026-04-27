/**
 * Builds a Move function target string for Enoki's allowedMoveCallTargets
 * @param module - The module name (e.g., 'counter')
 * @param fn - The function name (e.g., 'increment')
 * @returns Full target string like "0x123...::counter::increment"
 */
export const getMoveTarget = (module: string, fn: string) =>
  `${process.env.NEXT_PUBLIC_PACKAGE}::${module}::${fn}`;

/**
 * Canonical list of Move targets this app can sponsor through Enoki.
 * Keep this list in sync with callable public functions in the Move package.
 */
export const getAllowedMoveCallTargets = () => [
  // ticket_stage.move
  getMoveTarget("ticket_stage", "mint_attended"),
  getMoveTarget("ticket_stage", "mint_collectible"),
  getMoveTarget("ticket_stage", "mint_purchased"),
  // loyalty.move
  getMoveTarget("loyalty", "mint"),
  getMoveTarget("loyalty", "new_loyalty_point_permit"),
  getMoveTarget("loyalty", "add_points"),
  getMoveTarget("loyalty", "tenure_date"),
  getMoveTarget("loyalty", "loyalty_points"),
  // ticket.move
  getMoveTarget("ticket", "new_mint_permit"),
  getMoveTarget("ticket", "mint"),
  getMoveTarget("ticket", "update_stage"),
  getMoveTarget("ticket", "loyalty_id"),
  getMoveTarget("ticket", "loyalty_points"),
  getMoveTarget("ticket", "event_id"),
  getMoveTarget("ticket", "event_date"),
  getMoveTarget("ticket", "event_location"),
  getMoveTarget("ticket", "venue"),
  getMoveTarget("ticket", "section"),
  getMoveTarget("ticket", "seats"),
  getMoveTarget("ticket", "event_description"),
  getMoveTarget("ticket", "event_name"),
  getMoveTarget("ticket", "stage"),
  getMoveTarget("ticket", "price"),
  // key_registry.move
  getMoveTarget("key_registry", "consume_nonce"),
  getMoveTarget("key_registry", "cleanup_nonces"),
  getMoveTarget("key_registry", "set_pk"),
  getMoveTarget("key_registry", "assert_sender_is_key_owner"),
  getMoveTarget("key_registry", "derive_address_from_pk"),
  getMoveTarget("key_registry", "pk"),
  getMoveTarget("key_registry", "used_nonces"),
];
