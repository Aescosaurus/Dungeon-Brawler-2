class Boss extends Enemy
{
	constructor( pos,bossScale = 2,sprShtPath = null,sprSize = 16 )
	{
		super( pos,null )
		this.SetBoss( bossScale )
		this.size.Scale( 2 )
		
		if( sprShtPath != null )
		{
			this.sprSht = new SprSheet( SpriteCodex.LoadSpr( sprShtPath ),sprSize,sprSize )
			this.idleAnim = new Anim( this.sprSht,0,2 )
			this.walkAnim = new Anim( this.sprSht,1,2 )
			this.animHand = new AnimHandler( [ this.idleAnim,this.walkAnim ] )
		}
		
		this.phase = 0
	}
	
	Update( info )
	{
		if( this.phaseAI ) this.phase = this.phaseAI.Update( this,info )
		
		this.UpdateAnim()
	}
	
	UpdateAnim()
	{
		if( this.animHand )
		{
			// don't auto switch anims for bosses
			// this.animHand.SwitchTo( this.aiMove.Equals( Vec2.Zero() ) ? 0 : 1,false )
			
			this.animHand.Update()
		}
	}
}