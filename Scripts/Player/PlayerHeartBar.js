class PlayerHeartBar
{
	constructor( maxHP )
	{
		this.heartWidth = 8
		this.heartHeight = 7
		this.sprSht = new SprSheet( SpriteCodex.LoadSpr( "Images/UI/Hearts.png" ),
			this.heartWidth,this.heartHeight )
		this.nHeartParts = 6
		
		// round to nearest divisible of 6 so hearts look full when full hp
		this.fakeMaxHP = maxHP + ( this.nHeartParts - ( maxHP % this.nHeartParts ) )
		this.realMaxHP = maxHP
		this.nHeartDrawSprs = Math.floor( this.fakeMaxHP / this.nHeartParts )
	}
	
	Draw( pos,curHP,gfx )
	{
		const percent = curHP / this.realMaxHP
		let remainingHP = Math.floor( percent * this.fakeMaxHP )
		for( let i = 0; i < this.nHeartDrawSprs; ++i )
		{
			this.sprSht.Draw( pos.x - ( this.nHeartDrawSprs * this.heartWidth / 2 ) +
				i * this.heartWidth,pos.y - 8 - 4,
				0,this.nHeartParts - Math.max( Math.min( remainingHP + 1,6 ),1 ),
				gfx,false )
			
			remainingHP -= 6
		}
	}
}