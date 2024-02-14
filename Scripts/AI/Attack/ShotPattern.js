class ShotPattern
{
	// angleOffset is degrees
	constructor( nShots = 1,shotAng = 15,autoAng = false,angleOffset = 0 )
	{
		this.nShots = nShots
		if( autoAng ) this.spread = ( 360 / nShots ) * ( Math.PI / 180 )
		else this.spread = shotAng * ( Math.PI / 180 )
		
		this.angleOffset = Utils.Deg2Rad( angleOffset )
	}
	
	GetShotAngles( myPos = Vec2.Zero(),targetPos = Vec2.Up() )
	{
		const shotAngs = []
		
		const diff = targetPos.Copy().Subtract( myPos )
		const ang = Math.atan2( diff.y,diff.x )
		
		if( this.nShots == 1 )
		{
			shotAngs.push( ang )
		}
		else if( this.nShots % 2 == 0 )
		{
			const hSize = Math.floor( this.nShots / 2 )
			for( let i = -hSize; i < hSize; ++i )
			{
				const curAng = ang + i * this.spread + ( this.spread / 2 )
				shotAngs.push( curAng + this.angleOffset )
			}
		}
		else
		{
			const hSize = Math.floor( this.nShots / 2 )
			for( let i = -hSize; i <= hSize; ++i )
			{
				const curAng = ang + i * this.spread
				shotAngs.push( curAng + this.angleOffset )
			}
		}
		
		return( shotAngs )
	}
}