class Quiver extends Item
{
	constructor()
	{
		super()
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/Quiver.png" )
	}
	
	TriggerPickup( info )
	{
		this.buffs.push( new Buff( BuffType.Piercing,1,true ) )
	}
}