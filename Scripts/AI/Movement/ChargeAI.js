class ChargeAI extends MovementAI
{
	constructor( targetFinderFunc = TargetFinder.FindClosest )
	{
		super()
		
		this.targetFinderFunc = targetFinderFunc
		
		this.moveDir = Vec2.Zero()
		this.setMoveDir = false
	}
	
	GetMove( self,info )
	{
		if( !this.setMoveDir )
		{
			const target = this.targetFinderFunc( self,info.players )
			let targetPos = Vec2.Zero()
			if( target ) targetPos = target.pos.Copy()
			else targetPos = info.map.Tile2WorldPos( info.map.GetRandTilePos() )
			
			this.moveDir = targetPos.Subtract( self.pos ).Normalize()
			
			this.setMoveDir = true
		}
		
		return( this.moveDir )
	}
	
	Reset()
	{
		this.setMoveDir = false
	}
}