class Barkeep extends Boss
{
	constructor( pos )
	{
		super( pos,1,"Images/Enemy/Barkeep.png" )
		
		this.hp = 65
		
		const aoeDur = 1
		const aoeBulletRange = 400
		
		this.phaseAI = new PhaseAI( [
			new Phase(
				new ChargeAI( TargetFinder.FindClosest ),0.4,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 1,0,false,0 )
					],0.3,TargetFinder.TargetAIMove )
				],
				1.5,5 ),
			new Phase(
				new StandStillAI(),0,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 4,0,true,45,-1,aoeBulletRange )
					],-1,TargetFinder.Up )
				],
				aoeDur ),
			new Phase(
				new StandStillAI(),0,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 4,0,true,45,-1,aoeBulletRange )
					],-1,TargetFinder.Up )
				],
				aoeDur ),
			new Phase(
				new StandStillAI(),0,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 4,0,true,0,-1,aoeBulletRange )
					],-1,TargetFinder.Up )
				],
				aoeDur ),
			new Phase(
				new StandStillAI(),0,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 4,0,true,45,-1,aoeBulletRange )
					],-1,TargetFinder.Up )
				],
				aoeDur )
		] )
		
		this.animHand.SwitchTo( 1,false )
		for( let i = 0; i < 4; ++i ) this.phaseAI.GotoNextPhase()
	}
	
	Update( info )
	{
		super.Update( info )
		
		switch( this.phase )
		{
		case 0:
			this.animHand.SwitchTo( 0,false )
			break
		case 1:
			this.animHand.SwitchTo( 1,false )
			break
		}
	}
}