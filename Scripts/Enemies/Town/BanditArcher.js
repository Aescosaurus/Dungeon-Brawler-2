class BanditArcher extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/BanditArcher.png" )
		this.hp = 10
		
		this.spd = 0.3
		this.moveDelay.SetDur( 1.4 )
		
		this.attackPattern = null
		this.sprayTimer = new Timer( 3,false,true )
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),7,0.4,3 )
		this.bulletSpd = 1
		this.bulletRange = 140
		this.targetStyle = TargetFinder.FindFarthest
		
		this.sprayTargetPos = null
	}
	
	UpdateMove( info )
	{
		if( !this.sprayTimer.IsDone() ) super.UpdateMove( info )
	}
	
	SetSprayTarget( info )
	{
		const target = this.targetStyle( this,info.players )
		if( target != null )
		{
			this.sprayTargetPos = target.pos.Copy()
			this.dir = Math.sign( this.sprayTargetPos.Copy().Subtract( this.pos ).x )
			this.aiMove.SetXY( 0,0 )
		}
	}
}