class PlayerSwapEntity extends Entity
{
	constructor( pos,id,player )
	{
		super( pos,Vec2.One() )
		
		this.idleAnim = player.idleAnim
		this.id = id
		
		this.markerSpr = new Sprite( "Images/Marker.png" )
		this.markerFloatTimer = new Timer( 1.0 )
		this.markerFloatDist = 2
		this.markerHeightOffset = 7.5
		
		this.interactRange = 4
		
		this.canSwap = []
	}
	
	Update( info )
	{
		if( this.markerFloatTimer.Update() ) this.markerFloatTimer.Reset( true )
		
		for( let i = 0; i < info.playerList.length; ++i )
		{
			const player = info.playerList[i]
			if( player.pos.Copy().Subtract( this.pos ).GetLenSq() < Math.pow( this.interactRange,2 ) )
			{
				if( this.canSwap[i] )
				{
					info.playerManager.PossessPlayer( player,this.id,this.pos,info.map )
					
					if( player.GetPlayerId() < 0 )
					{
						this.hp = -1
					}
					else
					{
						this.id = player.GetPlayerId()
						this.idleAnim = player.idleAnim
						this.idleAnim.Reset()
					}
				}
				
				this.canSwap[i] = false
			}
			else this.canSwap[i] = true
		}
	}
	
	Draw( gfx )
	{
		const drawPos = this.pos.Copy().Subtract( this.idleAnim.sprSht.GetItemSize().Copy().Divide( 2 ) )
		this.idleAnim.Draw( drawPos,gfx )
		
		gfx.DrawSprite( drawPos.x,drawPos.y - this.markerHeightOffset -
			Math.sin( this.markerFloatTimer.GetPercent() * Math.PI * 2.0 ) * this.markerFloatDist,
			this.markerSpr )
	}
}