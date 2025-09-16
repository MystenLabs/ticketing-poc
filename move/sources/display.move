/// This module configures the visual metadata and display properties for NFT objects
/// in the ticketing system. It creates display templates that define how tickets,
/// loyalty objects, and ticket stage updates appear in wallets and dapps.
module ticketing_poc::display;

use sui::{display::{Self, Display}, package::Publisher};
use ticketing_poc::{
    loyalty::Loyalty,
    ticket::Ticket,
    ticket_stage::{StageTransition, Purchased, Attended, Collectible}
};

/// Creates all display templates for the ticketing system.
/// This function is called during package initialization to set up
/// the visual metadata templates for all NFT types in the system.
public(package) fun create(
    pub: &Publisher,
    ctx: &mut TxContext,
): (
    Display<Ticket>,
    Display<Loyalty>,
    Display<StageTransition<Purchased>>,
    Display<StageTransition<Attended>>,
    Display<StageTransition<Collectible>>,
) {
    let ticket_display = init_ticket_display(pub, ctx);
    let loyalty_display = init_loyalty_display(pub, ctx);
    let ticket_stage_display_purchased = init_ticket_stage_display_purchased(pub, ctx);
    let ticket_stage_display_attended = init_ticket_stage_display_attended(pub, ctx);
    let ticket_stage_display_collectible = init_ticket_stage_display_collectible(pub, ctx);

    (
        ticket_display,
        loyalty_display,
        ticket_stage_display_purchased,
        ticket_stage_display_attended,
        ticket_stage_display_collectible,
    )
}

/// Initializes the display template for ticket objects
fun init_ticket_display(pub: &Publisher, ctx: &mut TxContext): Display<Ticket> {
    let mut display = display::new<Ticket>(pub, ctx);
    display.add(b"name".to_string(), b"Ticket: {event_name}".to_string());
    display.add(b"description".to_string(), b"{event_description}".to_string());
    display.add(
        b"image_url".to_string(),
        b"https://ticketing-poc.vercel.app/frontViews/{event_id}.svg".to_string(),
    );
    display.update_version();
    display
}

/// Initializes the display template for loyalty objects
fun init_loyalty_display(pub: &Publisher, ctx: &mut TxContext): Display<Loyalty> {
    let mut display = display::new<Loyalty>(pub, ctx);
    display.add(b"name".to_string(), b"Loyalty".to_string());
    display.add(b"description".to_string(), b"Welcome to the loyalty program".to_string());
    // TODO: update image with production loyalty artwork
    display.add(
        b"image_url".to_string(),
        b"https://placehold.co/600x600/orange/white?text=Loyalty%0APoint:+{loyalty_points}".to_string(),
    );
    display.update_version();
    display
}

/// Initializes the display template for ticket stage transitions
fun init_ticket_stage_display_purchased(
    pub: &Publisher,
    ctx: &mut TxContext,
): Display<StageTransition<Purchased>> {
    let mut display = display::new<StageTransition<Purchased>>(pub, ctx);
    display.add(b"name".to_string(), b"Ticket Stage Update - Purchased".to_string());
    display.add(b"description".to_string(), b"Update your ticket stage to purchased".to_string());
    // TODO: update image with production stage transition artwork
    display.add(
        b"image_url".to_string(),
        b"https://placehold.co/600x600/red/white?text=TicketStage_Purchased".to_string(),
    );
    display.update_version();
    display
}

fun init_ticket_stage_display_attended(
    pub: &Publisher,
    ctx: &mut TxContext,
): Display<StageTransition<Attended>> {
    let mut display = display::new<StageTransition<Attended>>(pub, ctx);
    display.add(b"name".to_string(), b"Ticket Stage Update - Attended".to_string());
    display.add(b"description".to_string(), b"Update your ticket stage to attended".to_string());
    // TODO: update image with production stage transition artwork
    display.add(
        b"image_url".to_string(),
        b"https://placehold.co/600x600/blue/white?text=TicketStage_Attended".to_string(),
    );
    display.update_version();
    display
}

fun init_ticket_stage_display_collectible(
    pub: &Publisher,
    ctx: &mut TxContext,
): Display<StageTransition<Collectible>> {
    let mut display = display::new<StageTransition<Collectible>>(pub, ctx);
    display.add(b"name".to_string(), b"Ticket Stage Update - Collectible".to_string());
    display.add(b"description".to_string(), b"Update your ticket stage to collectible".to_string());
    // TODO: update image with production stage transition artwork
    display.add(
        b"image_url".to_string(),
        b"https://placehold.co/600x600/green/white?text=TicketStage_Collectible".to_string(),
    );
    display.update_version();
    display
}
