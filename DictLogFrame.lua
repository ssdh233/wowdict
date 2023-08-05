DictLogWithoutHole = {}
DictLogFrame_Page = 0
DictLogFrame_PageSize = 20

SLASH_DICTLOG1 = "/dictlog"
SlashCmdList["DICTLOG"] = function()
  DictLogWithoutHole = {}

  for k, v in pairs(DictLog) do
    if (v) then table.insert(DictLogWithoutHole, v) end
  end

  if DictLogFrame:IsShown() then
    HideUIPanel(DictLogFrame)
  else
    DictLogFrame_Page = 0
    ShowUIPanel(DictLogFrame)
    DictLogFrame_Update()
  end
end

function DictLogFrame_Update()
  local wordCount = table.getn(DictLogWithoutHole);
  local pageTotal = math.ceil(table.getn(DictLogWithoutHole) / DictLogFrame_PageSize);


  for i = 1, DictLogFrame_PageSize do 
    if _G["DictLogButton"..i] then
      _G["DictLogButton"..i]:Hide()
    end
  end

  local j = 1;
  for i = wordCount - DictLogFrame_Page * DictLogFrame_PageSize, 1, -1 do
    if j > DictLogFrame_PageSize then break end;
    if DictLogWithoutHole[i] then
      _G["DictLogButton"..j]:Show()
      _G["DictLogButton"..j.."Name"]:SetText(DictLogWithoutHole[i][1])
      _G["DictLogButton"..j.."Level"]:SetText(DictLogWithoutHole[i][2])
      local month = string.sub(""..DictLogWithoutHole[i][3],5,6)
      local day = string.sub(DictLogWithoutHole[i][3],7,8)
      _G["DictLogButton"..j.."Class"]:SetText(month.."/"..day)

      _G["DictLogButton"..j]:SetScript("OnClick", function(self)
        DictFrame_LookUp(DictLogWithoutHole[i][1])
      end
      )

      j = j + 1
    end
  end

  if DictLogFrame_Page <= 0 then
    DictLogPrevButton:Disable()
  else
    DictLogPrevButton:Enable()
  end

  if DictLogFrame_Page >= math.ceil(table.getn(DictLogWithoutHole) / DictLogFrame_PageSize) - 1 then
    DictLogNextButton:Disable()
  else
    DictLogNextButton:Enable()
  end

  DictLogFramePage:SetText((DictLogFrame_Page + 1).."/"..pageTotal)
end

function DictLogFrame_onPageChange(isNext)
  if isNext then
    if DictLogFrame_Page < math.ceil(table.getn(DictLogWithoutHole) / DictLogFrame_PageSize) - 1 then
      DictLogFrame_Page = DictLogFrame_Page + 1;
      DictLogFrame_Update();
    end
  else
    if DictLogFrame_Page > 0 then
      DictLogFrame_Page = DictLogFrame_Page - 1;
      DictLogFrame_Update();
    end
  end
end

function DictLogFrameColumn_SetWidth(frame, width)
	frame:SetWidth(width);
	local name = frame:GetName().."Middle";
	local middleFrame = _G[name];
	if middleFrame then
		middleFrame:SetWidth(width - 9);
	end
end
