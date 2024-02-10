class DarkHorse extends Boss
{
	constructor( pos )
	{
		super( pos,1.5,"Images/Enemy/DarkHorse.png" )
		
		this.hp = 300
		
		this.state = new Counter( 3 )
		
		this.phase0Timer = new Timer( 5 )
		this.phase0ShotgunTimer = new Timer( 0.7 )
		this.wiggleAI = new WiggleAI( 0.3 )
		this.wiggleSpd = 0.14
		this.shotgunPattern = new ShotPattern( 2,7 )
		this.shotgunRange = 900
		this.shotgunSpd1 = 1.3
		this.shotgunSpd2 = 0.9
		
		this.phase1WindUp = new Timer( 0.7 )
		this.chargeCounter = new Counter( 5 )
		this.chargeDur = new Timer( 0.5 )
		this.chargeTargetSpot = Vec2.Zero()
		this.chargeVel = Vec2.Zero()
		this.chargeSpd = 2
		this.chargeAOE = new ShotPattern( 16,0,true )
		this.aoeRange = 900
		this.aoeSpd = 1
		this.chargeCooldown = new Timer( 0.7,true )
		
		this.spinWindUp = new Timer( 0.7 )
		this.spinSpray = new SprayPattern( new ShotPattern( 4,0,true ),6,0.1,20 )
		this.spinShotSpd = 1.5
		this.spinShotRange = 900
		
		this.animHand.SwitchTo( 0 )
	}
	
	Update( info )
	{
		this.animHand.Update()
		
		switch( this.state.GetCurItem() )
		{
		case 0: // move back & forth while shooting plus shaped shotgun
			if( this.phase0Timer.Update() )
			{
				this.phase0ShotgunTimer.Reset()
				
				this.phase0Timer.Reset()
				this.state.Tick()
				
				this.SetTargetSpot( info )
			}
			else
			{
				this.aiMove = this.wiggleAI.GetMove( this,info )
				this.TryMove( this.aiMove.Copy().Scale( this.wiggleSpd ),info.map )
				
				if( this.phase0ShotgunTimer.Update() )
				{
					this.phase0ShotgunTimer.Reset()
					
					let target = TargetFinder.FindRandom( info.players )
					if( target == null ) target = { pos: info.map.Tile2WorldPos(
						info.map.GetRandTilePos() ) }
					
					const angs = this.shotgunPattern.GetShotAngles( this.pos,target.pos )
					for( const ang of angs )
					{
						this.FireBullet( ang,info,this.shotgunSpd1,this.shotgunRange )
						this.FireBullet( ang + Math.PI / 2,info,this.shotgunSpd1,this.shotgunRange )
						this.FireBullet( ang + Math.PI,info,this.shotgunSpd1,this.shotgunRange )
						this.FireBullet( ang + Math.PI * 1.5,info,this.shotgunSpd1,this.shotgunRange )
						
						this.FireBullet( ang,info,this.shotgunSpd2,this.shotgunRange )
						this.FireBullet( ang + Math.PI / 2,info,this.shotgunSpd2,this.shotgunRange )
						this.FireBullet( ang + Math.PI,info,this.shotgunSpd2,this.shotgunRange )
						this.FireBullet( ang + Math.PI * 1.5,info,this.shotgunSpd2,this.shotgunRange )
					}
				}
			}
			break
		case 1: // charge to random spot then aoe
			if( this.phase1WindUp.Update() )
			{
				if( !this.chargeCooldown.Update() ) return
				
				if( this.chargeDur.Update() )
				{
					const angs = this.chargeAOE.GetShotAngles()
					for( const ang of angs )
					{
						this.FireBullet( ang,info,this.aoeSpd,this.aoeRange )
					}
					
					this.chargeCooldown.Reset()
					this.chargeDur.Reset()
					
					this.SetTargetSpot( info )
					
					if( this.chargeCounter.Tick() )
					{
						this.phase1WindUp.Reset()
						this.chargeCounter.Reset()
						this.chargeCooldown.Finish()
						this.state.Tick()
						
						this.animHand.SwitchTo( 1 )
					}
				}
				else // charge!
				{
					this.aiMove = this.chargeVel
					this.TryMove( this.aiMove,info.map )
					
					this.animHand.Update()
				}
			}
			break
		case 2: // spin spray
			{
				if( !this.spinWindUp.Update() ) return
				
				const result = this.spinSpray.Update( Vec2.Zero(),Vec2.Up() )
				if( result )
				{
					if( result.done )
					{
						this.spinWindUp.Reset()
						this.state.Reset()
						
						this.animHand.SwitchTo( 0 )
					}
					else
					{
						for( const ang of result.angs )
						{
							this.FireBullet( ang,info,this.spinShotSpd,this.spinShotRange )
						}
					}
				}
			}
			break
		}
	}
	
	SetTargetSpot( info )
	{
		const target = TargetFinder.FindFarthest( this,info.players )
		if( target != null ) this.chargeTargetSpot = target.pos.Copy()
		else
		{
			this.chargeTargetSpot = info.map.Tile2WorldPos( info.map.GetRandEmptyTilePos() )
		}
		this.chargeVel = this.chargeTargetSpot.Copy().Subtract( this.pos )
			.Normalize().Scale( this.chargeSpd )
	}
}