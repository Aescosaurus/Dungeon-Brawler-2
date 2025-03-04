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
		
		this.nMinions = 4
		const minionSpawnInterval = 1.0
		this.minionSpawnTimer = new Timer( minionSpawnInterval )
		this.minionSpawnCounter = new Counter( this.nMinions )
		this.minionSpawnRange = 8 * 2
		
		this.phaseAI = new PhaseAI( [
			new Phase( // shotguns
				new StandStillAI(),0.0,
				[
					new PhaseAttackPattern( [
						new PhaseShotPattern( 4,30 )
					],1.5,TargetFinder.FindFarthest )
				],10.0
			),
			new Phase( // spiral bullets & spawn minions
				new StandStillAI(),0.0,
				[
					new PhaseAttackPatternSpray( new PhaseSprayPattern( 
						new ShotPattern( 1 ),
						360 / this.nMinions,minionSpawnInterval,this.nMinions ),
						TargetFinder.Up )
				],this.nMinions * minionSpawnInterval + 0.5
			),
			new Phase( // aoe while minions roam
				new StandStillAI(),0.0,
				[
					new PhaseAttackPatternSpray( new PhaseSprayPattern(
						new ShotPattern( 2,180 ),40,1,4
					),4.0,TargetFinder.Up ),
					new PhaseAttackPattern( [
						new PhaseShotPattern( 6,0,true )
					],4.0,TargetFinder.Up )
				],20.0
			)
		] )
	}
	
	Update( info )
	{
		super.Update( info )
		
		// spawn enemies on right phase
		if( this.phase == 1 )
		{
			if( this.minionSpawnTimer.Update() )
			{
				this.minionSpawnTimer.Reset()
				
				const ang = ( 360 / this.nMinions ) * this.minionSpawnCounter.GetCurItem()
				const enemyPos = this.pos.Copy().Add( new Vec2( Math.cos( Utils.Deg2Rad( ang ) ),
					Math.sin( Utils.Deg2Rad( ang ) ) ).Scale( this.minionSpawnRange ) )
				info.enemies.push( Math.random() < 0.7 ? new LivingCarrot( enemyPos )
					: new CabbageRoller( enemyPos ) )
				
				if( this.minionSpawnCounter.Tick() )
				{
					this.minionSpawnTimer.Reset()
					this.minionSpawnCounter.Reset()
					this.phaseAI.GotoNextPhase()
				}
			}
		}
	}
}