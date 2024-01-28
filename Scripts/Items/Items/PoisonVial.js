class PoisonVial extends Item
{
	constructor()
	{
		super()
		
		this.killCounter.SetCount( 1 )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/PoisonVial.png" )
		this.bulletSpr = this.spr
	}
	
	TriggerKill( info )
	{
		const target = TargetFinder.FindClosest( info.enemy,info.enemies,info.enemy )
		if( target != null ) this.FireBullet( info.enemy.pos,Utils.GetAng( info.enemy.pos,target.pos ),info )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
	{
		const bullet = super.CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
		bullet.rotSpd = 30
		return( bullet )
	}
}