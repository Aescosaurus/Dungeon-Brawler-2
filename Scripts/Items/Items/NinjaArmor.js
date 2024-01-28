class NinjaArmor extends Item
{
	constructor()
	{
		super()
		
		this.takeDmgCounter.SetCount( 1 )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/NinjaArmor.png" )
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Items/Dagger.png" )
	}
	
	TriggerTakeDmg( info )
	{
		const target = info.enemy
		if( target != null ) this.FireBullet( info.self.pos,Utils.GetAng( info.self.pos,target.pos ),info )
	}
}