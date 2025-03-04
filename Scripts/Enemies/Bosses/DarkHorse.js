class DarkHorse extends Boss
{
	constructor( pos )
	{
		super( pos,1.5,"Images/Enemy/DarkHorse.png" )
		
		this.hp = 300
		
		const shotgunSpd1 = 1.3
		const shotgunSpd2 = 0.9
		const shotgunRange = 900
		
		const aoeSpd = 1
		const aoeRange = 900
		
		const spinShotSpd = 1.5
		const spinShotRange = 900
		
		this.phaseAI = new PhaseAI( [
			new Phase(
				new WiggleAI( 0.3 ),0.14,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 2,7,false,0,shotgunSpd1,shotgunRange ),
						new PhaseShotPattern( 2,7,false,90,shotgunSpd1,shotgunRange ),
						new PhaseShotPattern( 2,7,false,180,shotgunSpd1,shotgunRange ),
						new PhaseShotPattern( 2,7,false,270,shotgunSpd1,shotgunRange ),
						
						new PhaseShotPattern( 2,7,false,0,shotgunSpd2,shotgunRange ),
						new PhaseShotPattern( 2,7,false,90,shotgunSpd2,shotgunRange ),
						new PhaseShotPattern( 2,7,false,180,shotgunSpd2,shotgunRange ),
						new PhaseShotPattern( 2,7,false,270,shotgunSpd2,shotgunRange )
						],0.7,TargetFinder.FindRandom )
				],
				5.0 ),
			new WaitPhase( 0.7 ),
			new Phase(
				new ChargeAI( TargetFinder.FindFarthest ),2,
				[
					new PhaseAttackPattern( [
						new ShotPattern( 16,0,true,aoeSpd,aoeRange )
					],0.5,TargetFinder.Up )
				],
				0.5,5,0.7 ),
			new WaitPhase( 0.7 ),
			new Phase(
				null,0,
				[
					new PhaseAttackPatternSpray( new PhaseSprayPattern(
						new ShotPattern( 4,0,true ),6,0.1,20,spinShotSpd,spinShotRange ) )
				] )
		] )
	}
	
	Update( info )
	{
		super.Update( info )
		
		switch( this.phase )
		{
		case 0:
			this.animHand.SwitchTo( 0,false )
			break
		case 2:
			// double spd anim for charge
			if( !this.aiMove.Equals( Vec2.Zero() ) ) this.animHand.Update()
			break
		case 4:
			this.animHand.SwitchTo( 1,false )
			break
		}
	}
}