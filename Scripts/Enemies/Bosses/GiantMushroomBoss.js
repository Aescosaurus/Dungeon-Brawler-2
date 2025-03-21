class GiantMushroomBoss extends Boss
{
	constructor( pos )
	{
		super( pos,3,"Images/Enemy/Mushroom.png",8 )
		
		this.hp = 290
		this.bulletRange = 120
		
		this.phaseAI = new PhaseAI( [
			new Phase( new WiggleAI( 0.8 ),0.3,[
				new PhaseAttackPatternSpray( new PhaseSprayPattern( new ShotPattern( 2,15 ),18,0.2,5,-1,-1,true ),
					3,TargetFinder.FindRandom )
			],20 ),
			new Phase( new StandStillAI(),0,[
				new PhaseAttackPattern( [ new PhaseShotPattern( 6,9 ) ],4.5 )
			],25 ),
			new Phase( new ChargeAI(),0.16,[
				new PhaseAttackPattern( [ new PhaseShotPattern( 4,-1,true,45 ) ],1,TargetFinder.FindFarthest )
			],15 )
		] )
		
		this.phaseAI.GotoNextPhase()
		this.phaseAI.GotoNextPhase()
		
		this.enemySpawnTimer = new Timer( 6.0 )
		this.enemySpawnThresh = 5
	}
	
	Update( info )
	{
		super.Update( info )
		
		// spawn adds when there's under certain thresh of enemies
		if( info.enemies.length < this.enemySpawnThresh && this.enemySpawnTimer.Update() )
		{
			this.enemySpawnTimer.Reset()
			
			this.swampArea.SpawnEnemies( Math.random() < 0.3 ? 0 : 3,1,info.enemies,info.map )
		}
	}
	
	SetArea( area )
	{
		this.swampArea = area
	}
}