class GrowingPumpkinEntity extends Entity
{
	constructor( pos )
	{
		super( pos,Vec2.One().Scale( 7.5 * 0.5 ),9999 )
		
		this.sprSht = new SprSheet( new Sprite( "Images/Enemy/Pumpkin.png" ),8,8 )
		this.idleAnim = new Anim( this.sprSht,0,2,0 )
		
		this.growthStages = [
			Vec2.One().Scale( 0.5 ),
			Vec2.One().Scale( 0.7 ),
			Vec2.One().Scale( 1 ),
			Vec2.One().Scale( 1.35 ),
			Vec2.One().Scale( 1.8 )
		]
		
		this.curGrowthStage = 0
	}
	
	Draw( gfx )
	{
		this.idleAnim.DrawScaled( this.pos.Copy().Subtract( Vec2.One().Scale( this.size.x / 2 ) ),
			this.size.x / 7.5,gfx,-1 )
	}
	
	Grow()
	{
		++this.curGrowthStage
		this.size = this.growthStages[this.curGrowthStage].Copy().Scale( 7.5 )
	}
}