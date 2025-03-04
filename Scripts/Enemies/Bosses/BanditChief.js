class BanditChief extends Boss
{
	constructor( pos )
	{
		super( pos,1,"Images/Enemy/BanditChief.png" )
		
		this.hp = 100
		
		const chaseShotRange = 80
		
		const seekDist = 100
		const arrowShotRange = 600
		
		this.phaseAI = new PhaseAI( [
			new Phase(
				new ChargeAI( TargetFinder.FindClosest ),0.4,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 3,15,false,0,-1,chaseShotRange ),
						new PhaseShotPattern( 3,15,false,180,-1,chaseShotRange ),
						],0.8,TargetFinder.TargetAIMove )
				],
				3.1,3 ),
			new Phase(
				new FollowTargetAI( function( self,targets )
				{
					return( TargetFinder.FindAtDist( self,targets,seekDist ) )
				} ),0.1,
				[
					new PhaseAttackPatternSpray(
						new PhaseSprayPattern( new ShotPattern( 1 ),7,0.1,5,-1,arrowShotRange ),
						1.0,TargetFinder.FindRandom ),
					new PhaseAttackPatternSpray(
						new PhaseSprayPattern( new ShotPattern( 1 ),7,0.1,5,-1,arrowShotRange ),
						1.0,TargetFinder.FindRandom )
				],
				-1,5,0.6 )
		] )
	}
	
	Update( info )
	{
		super.Update( info )
		
		switch( this.phase )
		{
		case 0:
			this.animHand.SwitchTo( 1,false )
			break
		case 1:
			this.animHand.SwitchTo( 0,false )
			break
		}
	}
}