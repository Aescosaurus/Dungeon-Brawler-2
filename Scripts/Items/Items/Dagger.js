class Dagger extends Item
{
	constructor()
	{
		super()
		
		this.hitCounter.SetCount( 5 )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/Dagger.png" )
		this.bulletSpr = this.spr
	}
	
	TriggerHit( info )
	{
		const target = TargetFinder.FindClosest( info.self,info.enemies )
		if( target != null ) this.FireBullet( info.self.pos,Utils.GetAng( info.self.pos,target.pos ),info )
	}
}