class BigTreeBoss extends Boss
{
	constructor( pos )
	{
		super( pos,1,"Images/Enemy/BigTreeBoss.png" )
		
		this.hp = 200
		
		// big tree starts moving when it becomes a boss
		this.phaseAI = new PhaseAI( [
			
		] )
	}
}