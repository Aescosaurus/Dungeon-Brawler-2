class WiggleAI extends MovementAI
{
	constructor( wiggleInterval = 0.2 )
	{
		super()
		
		this.wiggleTimer = new Timer( wiggleInterval )
		
		this.wiggleDir = Vec2.Rand().Normalize()
	}
	
	GetMove( self,info )
	{
		if( this.wiggleTimer.Update() )
		{
			this.wiggleDir = Vec2.Rand().Normalize()
			this.wiggleTimer.Reset()
		}
		
		return( this.wiggleDir )
	}
}