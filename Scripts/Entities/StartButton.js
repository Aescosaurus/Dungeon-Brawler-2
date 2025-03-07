class StartButton extends Entity
{
	constructor( pos )
	{
		super( pos,Vec2.One() )
		
		this.spr = new Sprite( "Images/UI/StartButton.png" )
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.pos.x,this.pos.y,this.spr,false,true )
	}
}