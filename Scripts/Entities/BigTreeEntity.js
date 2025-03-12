class BigTreeEntity extends Boss
{
	constructor( pos )
	{
		super( pos,1,"Images/Enemy/BigTreeEntity.png" )
		
		this.hp = 9999
		this.bulletRange = 180
		
		this.phaseAI = new PhaseAI( [
			new Phase( new StandStillAI(),0,[
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true,45 ) ],-1,TargetFinder.Up )
			],1.5 ),
			new Phase( new StandStillAI(),0,[
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true ) ],-1,TargetFinder.Up )
			],1.5 )
		] )
	}
}