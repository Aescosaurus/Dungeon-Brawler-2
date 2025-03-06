class PlayerSwapEntity extends Entity
{
	constructor( pos,id,player )
	{
		super( pos,Vec2.One() )
		
		this.idleAnim = player.idleAnim
		this.id = id
		
		this.interactRange = 4
		
		this.canSwap = []
	}
	
	Update( info )
	{
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
		this.idleAnim.Draw( this.pos.Copy().Subtract( this.idleAnim.sprSht.GetItemSize().Copy().Divide( 2 ) ),
			gfx )
	}
}