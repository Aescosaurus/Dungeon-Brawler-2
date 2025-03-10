class SprayPattern
{
	constructor( shotPattern,rotSpd,shotInterval,shotCount,rotCentered = false )
	{
		this.shotPattern = shotPattern
		this.rotSpd = Utils.Deg2Rad( rotSpd )
		this.shotInterval = new Timer( shotInterval )
		this.shotCount = new Counter( shotCount + 1 )
		
		this.done = false
		
		this.startRot = rotCentered ? -this.rotSpd * ( ( shotCount + 1 ) / 2 ) : 0
		this.rot = this.startRot
	}
	
	Update( myPos,targetPos )
	{
		if( this.shotInterval.Update() )
		{
			this.rot += this.rotSpd
			this.shotInterval.Reset()
			
			const done = this.shotCount.Tick()
			this.done = done
			if( done ) this.Reset()
			
			const angs = this.shotPattern.GetShotAngles( myPos,targetPos )
			for( let i = 0; i < angs.length; ++i ) angs[i] += this.rot
			return( { angs: angs,done: done } )
		}
		
		return( null )
	}
	
	Reset()
	{
		this.shotCount.Reset()
		this.rot = this.startRot
		this.shotInterval.Reset()
		this.done = false
	}
	
	IsDone()
	{
		return( this.done )
	}
	
	GetDur()
	{
		return( this.shotInterval.GetDur() * this.shotCount.GetCount() )
	}
}