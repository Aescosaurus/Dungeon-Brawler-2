class GrowingPumpkinBoss extends Boss
{
	constructor( pos )
	{
		super( pos,1,"Images/Enemy/BanditChief.png" )
		
		this.hp = 160
		this.ai = new StandStillAI()
		this.spd = 0.0
		
		this.bulletSpd = 0.9
		this.bulletRange = 280
		
		this.ToggleInvul( true )
		
		// shoot shotgun rotating a bit each time
		// this.ToggleInvul - spawn bunch of enemies then invul until they are defeated
		//  shoot some kind of aoe while this is going on
		//   shoot alternating 8 then 2, the 2 rotating over a few cycles
		
		this.phaseAI = new PhaseAI( [
			new Phase(
				new StandStillAI(),0.0,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 4,30 )
					],1.5,TargetFinder.FindFarthest )
				],7.0,
			)
		] )
	}
	
	Update( info )
	{
		super.Update( info )
		
		// spawn enemies on right phase
	}
}