class MegaCrossbow extends Item
{
	constructor()
	{
		super()
		
		this.pierceCounter.SetCount( 3 )
		
		this.bulletScale = 5
		this.bulletRange = 900
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/MegaCrossbow.png" )
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Bullet/Arrow.png" )
	}
	
	TriggerPierce( info )
	{
		this.FireBullet( info.self.pos,Utils.GetAng( info.self.pos,info.enemy.pos ),info )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
	{
		const bullet = super.CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
		bullet.hp = 9999
		bullet.ScaleUp( this.bulletScale )
		bullet.SetIgnoreWalls( true )
		bullet.SetTriggerPierce( false )
		return( bullet )
	}
}