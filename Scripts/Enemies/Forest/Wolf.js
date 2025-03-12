class Wolf extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Wolf.png" )
		this.hp = 17
		
		this.baseSpd = 0.27
		this.spd = this.baseSpd
		this.dashSpd = 0.75
		this.dashDur = new Timer( 0.4 )
		this.dashTimer = new Timer( 1.8 )
		
		this.attackTimer = new Timer( 1.2,false,true )
		this.attackPattern = new ShotPattern( 3,20 )
		this.bulletSpd = 1.3
		this.bulletRange = 190
	}
	
	Update( info )
	{
		super.Update( info )
		
		if( this.dashTimer.Update() )
		{
			if( this.dashDur.Update() )
			{
				this.spd = this.baseSpd
				this.dashDur.Reset()
				this.dashTimer.Reset()
			}
			else this.spd = this.dashSpd
		}
	}
}