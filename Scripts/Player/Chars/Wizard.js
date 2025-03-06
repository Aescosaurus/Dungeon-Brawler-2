class Wizard extends Player
{
	constructor( pos,ctrls,playerId )
	{
		super( pos,ctrls,5,"Images/Char/Wizard.png",playerId )
		
		this.spd = 0.65
		
		this.bulletDmg = 4
		this.bulletRange = 400
		this.bulletScale = 1.5
		this.bulletSpd = 0.1
		this.bulletSpeedupRate = 0.05
		this.bulletMaxSpd = 6
		this.bulletSpawnDev = new Range( -7,7 )
		
		this.refire.SetDur( 3,true )
		
		this.shotPattern = new ShotPattern( 4,0,true )
		
		this.flurryCounter = new Counter( 16,true )
		this.flurryRefire = new Timer( 0.09 )
	}
	
	Update( info )
	{
		super.Update( info )
		
		if( this.refire.Update() && this.CanFire( info ) )
		{
			this.refire.Reset()
			
			const angs = this.shotPattern.GetShotAngles( Vec2.Zero(),Vec2.Up() )
			for( const ang of angs ) this.FireAutoWizardBullet( info,ang )
		}
		
		if( !this.flurryCounter.IsDone() )
		{
			if( this.flurryRefire.Update() )
			{
				this.flurryCounter.Tick()
				this.flurryRefire.Reset()
				
				this.FireAutoWizardBullet( info,Utils.RandInt( 0,360 ) )
			}
		}
	}
	
	UseSuper( info )
	{
		this.flurryCounter.Reset()
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self )
	{
		const bullet = new MagicBullet( pos.Copy().Add(
			new Vec2( self.bulletSpawnDev.GetRandVal(),self.bulletSpawnDev.GetRandVal() ) ),
			ang,bulletSpd,self.bulletMaxSpd,
			self.bulletSpeedupRate,bulletRange )
		// bullet.ScaleUp( self.bulletScale )
		bullet.SetIgnoreWalls( true )
		bullet.rotate = true
		return( bullet )
	}
	
	FireAutoWizardBullet( info,ang )
	{
		const randEnemy = info.enemies[Utils.RandInt( 0,info.enemies.length )]
		this.FireBullet( ang,info )
		if( randEnemy ) info.playerBullets[info.playerBullets.length - 1].SetSeekTarget( randEnemy )
	}
}