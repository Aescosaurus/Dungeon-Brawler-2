class PlayerSwapEntity extends Entity
{
	constructor( pos,id,player )
	{
		super( pos,Vec2.One() )
		
		this.idleAnim = player.idleAnim
		this.id = id
	}
}