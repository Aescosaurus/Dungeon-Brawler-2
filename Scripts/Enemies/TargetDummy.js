class TargetDummy extends Enemy
{
	constructor( pos )
	{
		super( pos )
		
		this.hp = 99999
		this.spd = 0.0
		this.ai = new StandStillAI()
		
		this.ToggleInvul( true )
	}
	
	Update( info ) {}
}