use anchor_lang::prelude::*;

declare_id!("8cvPck4QVdw75bD6my4TCvQsYsF32yRtA1DFeQrmB7gd");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
