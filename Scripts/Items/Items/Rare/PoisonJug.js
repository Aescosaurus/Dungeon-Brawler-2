class PoisonJug extends Item
{
	constructor()
	{
		super()
		
		this.killCounter.SetCount( 1 )
		
		this.shotPattern = new ShotPattern( 8,0,true )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/PoisonJug.png" )
		this.bulletSpr = this.spr
	}
	
	TriggerKill( info )
	{
		const angs = this.shotPattern.GetShotAngles( Vec2.Zero(),Vec2.One() )
		
		for( const ang of angs ) this.FireBullet( info.enemy.pos,ang,info )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
	{
		const bullet = super.CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
		bullet.rotSpd = 30
		return( bullet )
	}
}