class BarkeepEntity extends Entity
{
	constructor( pos )
	{
		super( pos,Vec2.One().Scale( 7.5 ),9999 )
		
		this.sprSht = new SprSheet( new Sprite( "Images/Enemy/Barkeep.png" ),16,16 )
		const idleAnim = new Anim( this.sprSht,0,2 )
		const glugAnim = new Anim( this.sprSht,1,2 )
		this.animHand = new AnimHandler( [ idleAnim,glugAnim ] )
		
		this.glugInterval = new Timer( 5.0 )
		this.glugDur = new Timer( 1.9 )
		this.dirSwitchInterval = new Timer( 3.4 )
	}
	
	Update( info )
	{
		super.Update( info )
		
		if( this.animHand.GetCurAnim() == 1 ) this.animHand.Update()
		
		if( this.glugInterval.Update() )
		{
			this.animHand.SwitchTo( 1,false )
			if( this.glugDur.Update() )
			{
				this.animHand.SwitchTo( 0,true )
				this.glugDur.Reset()
				this.glugInterval.Reset()
			}
		}
		
		if( this.dirSwitchInterval.Update() )
		{
			this.dirSwitchInterval.Reset()
			
			this.dir = Math.random() < 0.5 ? 1 : -1
		}
	}
	
	Draw( gfx )
	{
		this.animHand.Draw( this.pos.Copy().Subtract( this.sprSht.GetItemSize().Copy().Divide( 2 ) ),
			gfx,this.dir < 0 )
	}
}