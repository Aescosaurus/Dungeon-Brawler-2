class AnimBullet extends Bullet
{
	constructor( pos,ang,spd,range,animPath,nSprs = 2,animSpd = 4 )
	{
		super( pos,ang,spd,range,null )
		
		this.sprSht = new SprSheet( SpriteCodex.LoadSpr( animPath ),this.size.x,this.size.y )
		this.anim = new Anim( this.sprSht,0,nSprs,animSpd )
	}
	
	Update( map,targets )
	{
		super.Update( map,targets )
		
		this.anim.Update()
	}
	
	Draw( gfx )
	{
		if( this.rotate )
		{
			this.anim.DrawRotated( this.pos.x,this.pos.y,this.angle + this.rotateOffset,gfx )
		}
		else
		{
			this.anim.Draw( this.pos.Copy().Subtract(
				this.anim.sprSht.GetItemSize().Copy().Divide( 2 ) ),gfx )
		}
	}
}