class Knight extends Player
{
	constructor( pos,ctrls,playerId )
	{
		super( pos,ctrls,15,"Images/Char/Knight.png",playerId )
		
		this.spd = 1
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Bullet/SwordBolt.png" )
		this.bulletRot = 45
		
		this.refire = new Timer( 0.4 )
		this.shotPattern = new ShotPattern()
		this.attackRange = 65
		this.bulletSpd = 2
		this.bulletRange = 60
		this.bulletDmg = 1.5
		
		this.superPattern = new ShotPattern( 32,0,true )
		this.superBulletDmg = 3
		this.superShotSpd = 3.5
		this.superShotRange = 200
	}
	
	Update( info )
	{
		super.Update( info )
		
		super.HandleSimpleShooting( info )
	}
	
	UseSuper( info )
	{
		const angs = this.superPattern.GetShotAngles( this.pos,this.pos.Copy().Add( Vec2.Up() ) )
		for( const ang of angs )
		{
			// const bullet = new Bullet( this.pos,ang,this.superShotSpd,this.superShotRange )
			// bullet.dmg = this.superBulletDmg
			// info.playerBullets.push( bullet )
			const self = this
			this.FireBullet( ang,info,this.superBulletDmg,function( pos,ang )
			{
				// const bullet = new Bullet( pos,ang,self.superShotSpd,self.superShotRange,self.bulletSpr )
				// bullet.rotate = true
				// bullet.rotateOffset = 
				// return( bullet )
				return( self.CreateBullet( pos,ang,self.superShotSpd,self.superShotRange,self ) )
			} )
		}
	}
}