class SpearBullet extends Bullet
{
	constructor( pos,ang,spd,range )
	{
		super( pos,ang,spd,range,SpriteCodex.LoadSpr( "Images/Bullet/Spear.png" ) )
		
		// 8x8 but the spr will fill in less space & look like a spear
		this.size = new Vec2( 8,8 )
		this.hp = 3
		this.rotate = true
	}
}