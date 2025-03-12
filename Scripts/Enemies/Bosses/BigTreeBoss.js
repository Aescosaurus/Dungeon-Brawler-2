class BigTreeBoss extends Boss
{
	constructor( pos )
	{
		super( pos,1,"Images/Enemy/BigTreeBoss.png" )
		
		this.hp = 200
		this.bulletRange = 180
		
		this.phaseAI = new PhaseAI( [
			new Phase( new FollowTargetAI(),0.3,[
				new PhaseAttackPattern( [ new PhaseShotPattern( 3,20 ),new PhaseShotPattern( 2,110 ) ],0.8 ),
				new PhaseAttackPattern( [ new PhaseShotPattern( 2,7 ) ],1.1,TargetFinder.FindFarthest )
			],15 ),
			new Phase( new WiggleAI( 0.5 ),0.15,[
				new PhaseAttackPatternSpray( new PhaseSprayPattern( new ShotPattern( 1 ),5.5,0.15,9,-1,-1,true ),0.25,
					TargetFinder.FindClosest ),
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true,45 ) ],4,TargetFinder.Up ),
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true ) ],4.5,TargetFinder.Up )
			],10 ),
			new Phase( new StandStillAI(),0,[
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true ) ],1,TargetFinder.Up ),
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true,20 ) ],2,TargetFinder.Up ),
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true,40 ) ],3,TargetFinder.Up )
			],7 )
		] )
	}
}