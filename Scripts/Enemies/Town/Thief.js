class Thief extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Thief.png" )
		this.hp = 8
		
		this.spd = 0.65
		this.moveDelay.SetDur( 0.8 )
		
		this.attackTimer = new Timer( 2,false,true )
		this.attackPattern = new ShotPattern( 2,0,true,90 )
		this.bulletSpd = 1.1
		this.bulletRange = 70
	}
}