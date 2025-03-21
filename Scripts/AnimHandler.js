class AnimHandler
{
	constructor( anims )
	{
		this.anims = anims
		
		this.curAnim = 0
	}
	
	Update()
	{
		this.anims[this.curAnim].Update()
	}
	
	Draw( pos,gfx,flipped = false )
	{
		this.anims[this.curAnim].Draw( pos,gfx,flipped )
	}
	
	DrawScaled( pos,scale,gfx,flipped = false )
	{
		this.anims[this.curAnim].DrawScaled( pos,scale,gfx,flipped )
	}
	
	SwitchTo( index,reset = true )
	{
		if( reset )
		{
			for( const anim of this.anims )
			{
				anim.Reset()
			}
		}
		
		this.curAnim = index
	}
	
	GetCurAnim()
	{
		return( this.curAnim )
	}
}