class Vampire extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Vampire.png" )
		this.col = "seagreen"
		this.hp = 5
		
		this.spd = 0.5
		this.moveDelay.SetDur( 0.65 )
		
		this.attackTimer = new Timer( 2,false,true )
		this.attackPattern = new ShotPattern( 2,30 )
		this.bulletSpd = 1
		this.bulletRange = 70
	}
}