class Basilisk extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Basilisk.png" )
		this.hp = 27
		
		this.baseSpd = 0.2
		this.chargeSpd = 0.9
		this.spd = this.baseSpd
		
		this.chargeAI = new FollowTargetAI()
		this.wiggleAI = new WiggleAI( 0.01 )
		this.ai = this.wiggleAI
		
		this.attackTimer = new Timer( 3,false,true )
		this.attackPattern = new ShotPattern( 6,-1,true )
		this.sprayTimer = new Timer( 1,false,true )
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),20,0.25,2,true )
		this.bulletSpd = 1.3
		this.bulletRange = 200
		
		this.chargeInterval = new Timer( 4,false,true )
		this.chargeDur = new Timer( 0.7,false,true )
	}
	
	UpdateMove( info )
	{
		if( this.chargeInterval.Update() )
		{
			if( this.chargeDur.Update() )
			{
				this.chargeInterval.Reset()
				this.chargeDur.Reset()
				this.ai = this.wiggleAI
				this.spd = this.baseSpd
			}
			else
			{
				this.spd = this.chargeSpd
				this.ai = this.chargeAI
			}
		}
		
		super.UpdateMove( info )
	}
}