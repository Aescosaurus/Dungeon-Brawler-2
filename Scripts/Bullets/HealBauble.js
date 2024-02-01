class HealBauble extends AnimBullet
{
	constructor( startPos,endPos,flightTime )
	{
		super( startPos,0,0,9999,"Images/Bullet/HealBullet2.png" )
		this.SetIgnoreWalls( true )
		
		this.dmg = -1
		
		this.startPos = startPos.Copy()
		this.endPos = endPos.Copy()
		
		if( flightTime < 0 ) flightTime = 0
		else if( flightTime > 1 ) flightTime = 1
		this.flightTimer = new Timer( flightTime )
		
		const g = 0.3
		this.grav = g
		const totalYMove = this.endPos.y - this.startPos.y
		const t = this.flightTimer.GetDur() * 60
		this.yVel = ( totalYMove / t ) - ( ( ( g * t * ( t - 1 ) ) / 2 ) / t )
	}
	
	Update( map,targets )
	{
		if( !this.flightTimer.Update() )
		{
			this.pos.x = Utils.Lerp( this.startPos.x,this.endPos.x,
				this.flightTimer.GetPercent() )
			
			this.pos.y += this.yVel
			this.yVel += this.grav
			
			this.anim.Update()
		}
		else
		{
			super.Update( map,targets )
			
			// just make sure we're in exactly the right spot
			//  having it disabled looks ok too tho
			this.pos.x = this.endPos.x
			this.pos.y = this.endPos.y
		}
	}
}