class VampireSword extends Item
{
	constructor()
	{
		super()
		
		this.killCounter.SetCount( 3 )
		
		this.heal = 1
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/VampireSword.png" )
	}
	
	TriggerKill( info )
	{
		info.self.Heal( this.heal,info.self )
	}
}