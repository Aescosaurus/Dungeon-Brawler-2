class FrogBig extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/FrogBig.png" )
		this.hp = 29
		
		this.spd = 0.5
		
		this.moveAI = new FollowTargetAI()
		this.pauseAI = new StandStillAI()
		
		this.attackTimer = new Timer( 2,false,true )
		this.attackPattern = new ShotPattern( 3,35 )
		this.sprayTimer = new Timer( 5,false,true )
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),20,0.25,5,true )
		this.bulletSpd = 1.1
		this.bulletRange = 150
		
		this.moveInterval = new Timer( 4,false,true )
		this.pauseDur = new Timer( 2,false,true )
	}
	
	UpdateMove( info )
	{
		if( this.moveInterval.Update() )
		{
			if( this.pauseDur.Update() )
			{
				this.moveInterval.Reset()
				this.pauseDur.Reset()
				this.ai = this.moveAI
			}
			else this.ai = this.pauseAI
		}
		
		super.UpdateMove( info )
	}
}