class Anim
{
	constructor( sprSheet,strip,nFrames,fps = 4 )
	{
		this.sprSht = sprSheet
		this.strip = strip
		this.nFrames = nFrames
		
		this.timer = new Timer( 1 / fps )
		this.frameCounter = new Counter( nFrames )
	}
	
	Update()
	{
		if( this.timer.Update() )
		{
			this.timer.Reset()
			if( this.frameCounter.Tick() )
			{
				this.frameCounter.Reset()
			}
		}
	}
	
	Draw( pos,gfx,flipped = false )
	{
		this.sprSht.Draw( pos.x,pos.y,this.strip,this.frameCounter.GetCurItem(),gfx,flipped )
	}
	
	DrawRotated( pos,angle,gfx )
	{
		this.sprSht.DrawRotated( pos.x,pos.y,this.strip,this.frameCounter.GetCurItem(),angle,gfx )
	}
	
	DrawScaled( pos,scale,gfx,flipped = false )
	{
		this.sprSht.DrawScaled( pos.x,pos.y,this.strip,this.frameCounter.GetCurItem(),
			scale,scale,gfx,flipped )
	}
	
	Reset()
	{
		this.timer.Reset()
		this.frameCounter.Reset()
	}
	
	SetFPS( fps )
	{
		this.timer.SetDur( 1 / fps )
	}
	
	SetFrame( frame )
	{
		this.frameCounter.SetCurItem( frame )
	}
}