class BanditWarrior extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/BanditWarrior.png" )
		this.hp = 12
		
		this.spd = 0.5
		this.moveDelay.SetDur( 0.5 )
		
		this.attackTimer = new Timer( 2,false,true )
		this.attackPattern = new ShotPattern( 3,25 )
		this.bulletSpd = 0.9
		this.bulletRange = 90
	}
}