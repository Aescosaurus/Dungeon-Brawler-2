class GrowingPumpkinEntity extends Entity
{
	constructor( pos )
	{
		super( pos,Vec2.One().Scale( 7.5 * 0.5 ),9999 )
		
		this.col = "#FFAA00"
		
		this.growthStages = [
			Vec2.One().Scale( 0.5 ),
			Vec2.One().Scale( 0.7 ),
			Vec2.One().Scale( 1 ),
			Vec2.One().Scale( 1.35 ),
			Vec2.One().Scale( 1.8 )
		]
		
		this.curGrowthStage = 0
	}
	
	Grow()
	{
		++this.curGrowthStage
		this.size = this.growthStages[this.curGrowthStage].Copy().Scale( 7.5 )
	}
}